import axiosClient from './axiosClient';

export interface StructureLabel {
  en: string;
  fr: string;
  ar: string;
  es: string;
}

export interface Structure {
  id: number;
  label: StructureLabel;
  code: string;
  id_parent: number | null;
  children?: Structure[];
}

export interface TreeNode {
  key: string;
  label: string;
  data: Structure;
  children?: TreeNode[];
}

export const structureService = {
  // Parse label from API response (handle both string and object formats)
  parseLabel(label: any): StructureLabel {
    if (typeof label === 'string') {
      try {
        return JSON.parse(label);
      } catch {
        return { en: label, fr: label, ar: label, es: label };
      }
    }
    return label as StructureLabel;
  },

  // Fetch all structures
  async getAll() {
    const response = await axiosClient.get<any[]>('/structures');
    return response.data.map(s => ({
      ...s,
      label: this.parseLabel(s.label)
    }));
  },

  // Fetch structures as tree
  async getTree() {
    const response = await axiosClient.get<any[]>('/structures/tree');
    return response.data.map(s => ({
      ...s,
      label: this.parseLabel(s.label)
    }));
  },

  // Fetch single structure
  async getById(id: number) {
    const response = await axiosClient.get<any>(`/structures/${id}`);
    return {
      ...response.data,
      label: this.parseLabel(response.data.label)
    };
  },

  // Create structure
  async create(data: Omit<Structure, 'id' | 'children'> | { label: string; code: string; id_parent: number | null }) {
    const response = await axiosClient.post<any>('/structures', data);
    return {
      ...response.data,
      label: this.parseLabel(response.data.label)
    };
  },

  // Update structure
  async update(id: number, data: Omit<Structure, 'id' | 'children'> | { label: string; code: string; id_parent: number | null }) {
    const response = await axiosClient.put<any>(`/structures/${id}`, data);
    return {
      ...response.data,
      label: this.parseLabel(response.data.label)
    };
  },

  // Delete structure
  async delete(id: number) {
    const response = await axiosClient.delete(`/structures/${id}`);
    return response.data;
  },

  // Get label in specified language
  getLabel(label: StructureLabel, lang: string = 'en'): string {
    return label[lang as keyof StructureLabel] || label.en || 'Unnamed';
  },

  // Convert flat structure array to tree nodes
  convertToTreeNodes(structures: Structure[], currentLang: string = 'en'): TreeNode[] {
    const map = new Map<number, TreeNode>();

    // Create all nodes
    structures.forEach((structure) => {
      const labelText = this.getLabel(structure.label, currentLang);
      map.set(structure.id, {
        key: `structure-${structure.id}`,
        label: `${labelText} (${structure.code})`,
        data: structure,
        children: [],
      });
    });

    // Build hierarchy
    const roots: TreeNode[] = [];
    structures.forEach((structure) => {
      const node = map.get(structure.id)!;
      if (structure.id_parent === null) {
        roots.push(node);
      } else {
        const parent = map.get(structure.id_parent);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(node);
        }
      }
    });

    return roots;
  },
};
