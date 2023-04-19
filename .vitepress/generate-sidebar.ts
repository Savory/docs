import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { load } from 'js-yaml';
import fm from 'front-matter';

declare interface Options {
    root?: string;
    rootGroupText?: string;
    collapsed?: boolean;
    collapseDepth?: number;
    hyphenToSpace?: boolean;
    underscoreToSpace?: boolean;
    capitalizeFirst?: boolean;
    withIndex?: boolean;
    useTitleFromFileHeading?: boolean;
    includeEmptyGroup?: boolean;
    sortByFileName?: string[];
    excludeDir?: string[];
    uppercase?: boolean;
    sortByFrontMatter?: boolean;

    locales?: string[];
}

declare interface SidebarItem {
    [key: string]: any;
}

export default class VitePressSidebar {
    static generateSidebar(options: Options): object {
        options.root = options?.root ?? '/';
        if (!/^\//.test(options.root)) {
            options.root = `/${options.root}`;
        }
        if (options.collapseDepth) {
            options.collapsed = true;
        }
        if (options.hyphenToSpace === null || options.hyphenToSpace === undefined) {
            options.hyphenToSpace = true;
        }

        options.rootGroupText = options?.rootGroupText ?? 'Table of Contents';
        options.collapseDepth = options?.collapseDepth ?? 1;
        options.sortByFileName = options?.sortByFileName ?? [];
        options.locales = options?.locales ?? [];

        const sidebar = {};
        ['/', ...options.locales].forEach((locale) => {
            const item: SidebarItem = VitePressSidebar.generateSidebarItem(
                1,
                join(process.cwd(), options.root + (locale === '/' ? '': locale)),
                options.root + (locale === '/' ? '': locale),
                options,
                locale,
            );
            const localePath = locale === '/' ? '/' : `/${locale}/`;
            sidebar[localePath] = item;
        });

        console.log(sidebar);
        return sidebar;
    }

    static generateSidebarItem(
        depth: number,
        currentDir: string,
        displayDir: string,
        options: Options,
        locale: string,
    ): SidebarItem {
        let directoryFiles: string[] = readdirSync(currentDir);

        if (options.sortByFileName!.length > 0) {
            const needSortItem = directoryFiles.filter((x) => options.sortByFileName?.indexOf(x) !== -1);
            const remainItem = directoryFiles.filter((x) => options.sortByFileName?.indexOf(x) === -1);
            needSortItem.sort(
                (a, b) => options.sortByFileName!.indexOf(a) - options.sortByFileName!.indexOf(b)
            );

            directoryFiles = [...needSortItem, ...remainItem];
        }

        directoryFiles = directoryFiles.filter((file) => {
            return !options.excludeDir || options.excludeDir?.indexOf(file) == -1;
        })

        if (options.sortByFrontMatter) {
            // @ts-ignore
            const fileOrderMap = new Map<string, {order: number, displayName: string}>();

            directoryFiles.forEach(file => {
                let orderData = {
                    fileName: file,
                    displayName: file,
                    order: 100,
                }
                let fileContent: string | null = null;
                const filePath = resolve(currentDir, file);
                if (statSync(filePath).isDirectory()) {
                    try {
                        fileContent = readFileSync(`${filePath}/index.yml`);
                        const data = load(fileContent.toString()) as {order: number};
                        orderData.order = data.order || 100;
                    } catch (e) {

                    }
                }
                else {
                    fileContent = readFileSync(filePath);
                    const frontMatterData = fm<{ order }>(fileContent.toString());
                    orderData.order = frontMatterData.attributes.order || 0;
                }
                fileOrderMap.set(file, orderData);
            });

            directoryFiles = directoryFiles.sort((first: string, second: string) => {
                const firstData = fileOrderMap.get(first);
                const secondData = fileOrderMap.get(second);
                return secondData.order - firstData.order;
            });
        }

        return directoryFiles
            .map((x: string) => {
                const childItemPath = resolve(currentDir, x);
                const childItemPathDisplay = `${displayDir}/${x}`
                    .replace(options.root ?? '', '')
                    .replace(/\/{2}/, '/')
                    .replace(/\.md$/, '');

                if (/\.vitepress/.test(childItemPath)) {
                    return null;
                }
                if (displayDir === (options.root + locale) && x === 'index.md' && !options.withIndex) {
                    return null;
                }

                if (options.excludeDir?.indexOf(displayDir) !== -1) {
                    return null;
                }

                if (statSync(childItemPath).isDirectory()) {
                    const directorySidebarItems =
                        VitePressSidebar.generateSidebarItem(
                            depth + 1,
                            childItemPath,
                            childItemPathDisplay,
                            options,
                            locale
                        ) || [];

                    if (options.includeEmptyGroup || directorySidebarItems.length > 0) {
                        return {
                            text: VitePressSidebar.getTitleFromMd(x, childItemPath, options, true),
                            items: directorySidebarItems,
                            collapsible: true,
                            ...(options.collapsed === null || options.collapsed === undefined
                                ? {}
                                : { collapsed: depth >= options.collapseDepth! && options.collapsed })
                        };
                    }

                    return null;
                }
                if (childItemPath.endsWith('.md')) {
                    return {
                        text: VitePressSidebar.getTitleFromMd(x, childItemPath, options),
                        link: childItemPathDisplay
                    };
                }
                return null;
            })
            .filter((x) => x !== null);
    }

    static getTitleFromMd(
        fileName: string,
        filePath: string,
        options: Options,
        isDirectory = false
    ): string {
        let result: string = options.capitalizeFirst
            ? fileName.charAt(0).toUpperCase() + fileName.slice(1)
            : fileName;
        if (options.uppercase) {
            result = result.toUpperCase();
        }
        if (!isDirectory) {
            if (options.useTitleFromFileHeading) {
                // Use content 'h1' string instead of file name
                try {
                    const data = readFileSync(filePath, 'utf-8');
                    const lines = data.split('\n');
                    for (let i = 0, len = lines.length; i < len; i += 1) {
                        let str = lines[i].toString().replace('\r', '');
                        if (str.indexOf('# ') !== -1) {
                            str = str.replace('# ', '');
                            return options.capitalizeFirst ? str.charAt(0).toUpperCase() + str.slice(1) : str;
                        }
                    }
                } catch {
                    return 'Unknown';
                }
            } else {
                result = result.replace(/\.md$/, '');

                if (options.hyphenToSpace) {
                    result = result.replace(/-/g, ' ');
                }

                if (options.underscoreToSpace) {
                    result = result.replace(/_/g, ' ');
                }
            }
        }

        return result;
    }
}

export const { generateSidebar } = VitePressSidebar;