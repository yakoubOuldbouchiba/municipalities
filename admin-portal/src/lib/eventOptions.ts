/**
 * Event Icon and Color Options
 * Centralized constants for event dropdowns
 */

import i18n from '../i18n';

export const getIconOptions = () => [
  { label: i18n.t('eventOptions.icons.flag'), value: 'pi pi-flag' },
  { label: i18n.t('eventOptions.icons.building'), value: 'pi pi-building' },
  { label: i18n.t('eventOptions.icons.star'), value: 'pi pi-star' },
  { label: i18n.t('eventOptions.icons.globe'), value: 'pi pi-globe' },
  { label: i18n.t('eventOptions.icons.calendar'), value: 'pi pi-calendar' },
  { label: i18n.t('eventOptions.icons.clock'), value: 'pi pi-clock' },
  { label: i18n.t('eventOptions.icons.users'), value: 'pi pi-users' },
  { label: i18n.t('eventOptions.icons.briefcase'), value: 'pi pi-briefcase' },
  { label: i18n.t('eventOptions.icons.home'), value: 'pi pi-home' },
  { label: i18n.t('eventOptions.icons.heart'), value: 'pi pi-heart' },
  { label: i18n.t('eventOptions.icons.checkmark'), value: 'pi pi-check' },
  { label: i18n.t('eventOptions.icons.exclamation'), value: 'pi pi-exclamation-triangle' },
];

export const getColorOptions = () => [
  { label: i18n.t('eventOptions.colors.green'), value: '#16a34a' },
  { label: i18n.t('eventOptions.colors.blue'), value: '#2563eb' },
  { label: i18n.t('eventOptions.colors.red'), value: '#dc2626' },
  { label: i18n.t('eventOptions.colors.purple'), value: '#9333ea' },
  { label: i18n.t('eventOptions.colors.orange'), value: '#ea580c' },
  { label: i18n.t('eventOptions.colors.pink'), value: '#ec4899' },
  { label: i18n.t('eventOptions.colors.yellow'), value: '#eab308' },
  { label: i18n.t('eventOptions.colors.cyan'), value: '#06b6d4' },
  { label: i18n.t('eventOptions.colors.gray'), value: '#6b7280' },
  { label: i18n.t('eventOptions.colors.teal'), value: '#14b8a6' },
];

// For backward compatibility, also export static options
export const ICON_OPTIONS = [
  { label: 'Flag', value: 'pi pi-flag' },
  { label: 'Building', value: 'pi pi-building' },
  { label: 'Star', value: 'pi pi-star' },
  { label: 'Globe', value: 'pi pi-globe' },
  { label: 'Calendar', value: 'pi pi-calendar' },
  { label: 'Clock', value: 'pi pi-clock' },
  { label: 'Users', value: 'pi pi-users' },
  { label: 'Briefcase', value: 'pi pi-briefcase' },
  { label: 'Home', value: 'pi pi-home' },
  { label: 'Heart', value: 'pi pi-heart' },
  { label: 'Checkmark', value: 'pi pi-check' },
  { label: 'Exclamation', value: 'pi pi-exclamation-triangle' },
];

export const COLOR_OPTIONS = [
  { label: 'Green', value: '#16a34a' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Purple', value: '#9333ea' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Yellow', value: '#eab308' },
  { label: 'Cyan', value: '#06b6d4' },
  { label: 'Gray', value: '#6b7280' },
  { label: 'Teal', value: '#14b8a6' },
];
