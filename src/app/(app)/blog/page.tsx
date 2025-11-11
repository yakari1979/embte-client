"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // <-- Importer
import Cookies from 'js-cookie';
import Link from 'next/link';
import { getPublishedBlogPosts, Post } from '@/services/api';
import { Newspaper, Calendar, User } from 'lucide-react';

// Fonction utilitaire pour créer un extrait de texte
const createExcerpt = (htmlContent: string, length = 150) => {
    const text = htmlContent.replace(/<[^>]*>/g, ''); // Enlève les balises HTML
    if (text.length <= length) return text;
    return text.substr(0, text.lastIndexOf(' ', length)) + '...';
};

const BlogPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            const token = Cookies.get('token');
            if (!token) {
                setError("Vous devez être connecté pour voir les annonces.");
                setIsLoading(false);
                return;
            }
            try {
                const { data } = await getPublishedBlogPosts(token);
                setPosts(data);
            } catch (err) {
                setError("Impossible de charger les annonces de l'établissement.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="bg-background min-h-screen">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="text-center mb-12">
                    <Newspaper className="mx-auto h-16 w-16 text-blue-500" />
                    <h1 className="mt-4 text-4xl font-extrabold text-text-primary tracking-tight">
                        Annonces de l'Établissement
                    </h1>
                    <p className="mt-2 max-w-2xl mx-auto text-lg text-text-secondary">
                        Retrouvez ici toutes les informations importantes, les nouveautés et les événements à venir.
                    </p>
                </header>

                {isLoading ? (
                    <div className="text-center text-text-secondary">Chargement des annonces...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : posts.length === 0 ? (
                    <div className="text-center text-text-secondary">Aucune annonce n'a été publiée pour le moment.</div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <Link href={`/blog/${post.id}`} key={post.id} className="group block">
                                <div className="h-full bg-surface rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-transparent dark:border-gray-800">
                                    {/* --- AFFICHER L'IMAGE SI ELLE EXISTE --- */}
                                    {post.coverImageUrl && (
                                        <div className="relative h-48 w-full">
                                            <Image
                                                src={post.coverImageUrl}
                                                alt={`Image de couverture pour ${post.title}`}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h2 className="text-xl font-bold text-text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {post.title}
                                        </h2>
                                        <div className="mt-3 flex items-center gap-4 text-sm text-text-secondary">
                                            <div className="flex items-center gap-1.5">
                                                <User size={14} />
                                                <span>{post.author.firstName} {post.author.lastName}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                <span>{new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-text-secondary text-base leading-relaxed">
                                            {createExcerpt(post.content)}
                                        </p>
                                        <div className="mt-4 font-semibold text-blue-600 dark:text-blue-400">
                                            Lire la suite &rarr;
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default BlogPage;