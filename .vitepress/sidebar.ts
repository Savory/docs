import { generateSidebar } from "./generate-sidebar.ts";

export const sidebar =  generateSidebar({
    root: 'src/',
    excludeDir: ['fr'],
    capitalizeFirst: true,
    sortByFrontMatter: true,
    locales: ['fr']
});