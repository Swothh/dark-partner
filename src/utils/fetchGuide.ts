import axios, { AxiosPromise } from 'axios';
import matter from 'gray-matter';
import config from '../configs';

interface IEntry {
    name: string;
    object: {
        entries: {
            name: string;
            object: {
                text: string;
            };
        }[];
    };
};

export const fetchGuide = async () => {
    const json = await axios.post('https://api.github.com/graphql', {
        query: `query Daisy($name: String!, $owner: String!, $expression: String) {
            repository(name: $name, owner: $owner) {
                collaborators {
                    nodes {
                        login
                        name
                    }
                }
                object(expression: $expression) {
                    ... on Tree {
                        entries {
                            name
                            object {
                                ... on Tree {
                                        entries {
                                        name
                                        object {
                                            ... on Blob {
                                                text
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }`,
        variables: {
            name: 'dark-guide',
            owner: 'swothh',
            expression: 'HEAD:'
        }
    }, {
        headers: {
            Authorization: `bearer ${config.main.__apikeys.github.guide}`
        }
    }).catch((err): AxiosPromise => err?.response).then(res => res?.data);

    if (!json || !json?.data) return false;
    const collaborators = json?.data?.repository?.collaborators?.nodes ?? [];
    const rawArticles = json?.data?.repository?.object?.entries ?? [];

    const articles = rawArticles.filter((entry: IEntry) => !entry.name?.endsWith?.('.md')).map((entry: IEntry) => {
        return {
            name: entry.name,
            locales: (entry?.object?.entries || []).reduce((obj, file) => {
                try {
                    const parsed = matter(file?.object?.text ?? '');
                    const content = parsed.content.slice(parsed.content.startsWith('\n') ? 1 : 0);

                    if (parsed?.data?.category && parsed?.data?.title) obj[file.name.replace('.md', '')] = {
                        data: parsed.data,
                        content
                    };

                    return obj;
                } catch(e) {
                    console.error(e);
                    return obj;
                };
            }, {} as any)
        };
    });

    return {
        collaborators,
        articles
    };
};