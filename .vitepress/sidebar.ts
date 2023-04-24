import { generateSidebar } from "./generate-sidebar";

export const sidebar =  generateSidebar({
    root: 'src/',
    collapsed: false,
    capitalizeFirst: true,
    sortByFrontMatter: true,
    excludeDir: ['fr', 'pt'],
    locales: ['fr', 'pt']
});