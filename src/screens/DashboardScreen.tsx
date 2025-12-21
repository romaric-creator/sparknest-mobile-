import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { FileText, Briefcase, MessageSquare, LogOut, Server, Cpu, Star, ShoppingCart } from 'lucide-react-native';
import { adminService, authService } from '../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
    const navigation = useNavigation();
    const [stats, setStats] = useState({ articles: 0, projects: 0, messages: 0, services: 0, technologies: 0, testimonials: 0, marketplaceItems: 0 });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [user, setUser] = useState(null);

    const loadData = async () => {
        try {
            const userData = await authService.getUser();
            setUser(userData);

            const [articles, projects, messages, services, technologies, testimonials, marketplaceItems] = await Promise.all([
                adminService.getArticles(),
                adminService.getProjects(),
                adminService.getMessages(),
                adminService.getServices(),
                adminService.getTechnologies(),
                adminService.getTestimonials(),
                adminService.getMarketplaceItems(),
            ]);

            setStats({
                articles: articles.data.length,
                projects: projects.data.length,
                messages: messages.data.filter(m => !m.read).length,
                services: services.data.length,
                technologies: technologies.data.length,
                testimonials: testimonials.data.length,
                marketplaceItems: marketplaceItems.data.length,
            });
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handleLogout = async () => {
        await authService.logout();
        navigation.replace('Login');
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0f172a" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0f172a" />
            }
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcome}>Bonjour,</Text>
                    <Text style={styles.name}>{user?.name || 'Admin'}</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <LogOut color="#ef4444" size={24} />
                </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
                <StatCard
                    title="Articles"
                    value={stats.articles}
                    icon={<FileText color="#0f172a" size={24} />}
                    onPress={() => navigation.navigate('Articles')}
                />
                <StatCard
                    title="Projets"
                    value={stats.projects}
                    icon={<Briefcase color="#0f172a" size={24} />}
                    onPress={() => navigation.navigate('Projects')}
                />
                <StatCard
                    title="Services"
                    value={stats.services}
                    icon={<Server color="#0f172a" size={24} />}
                    onPress={() => navigation.navigate('Services')}
                />
                <StatCard
                    title="Technologies"
                    value={stats.technologies}
                    icon={<Cpu color="#0f172a" size={24} />}
                    onPress={() => navigation.navigate('Technologies')}
                />
                <StatCard
                    title="Témoignages"
                    value={stats.testimonials}
                    icon={<Star color="#0f172a" size={24} />}
                    onPress={() => navigation.navigate('Testimonials')}
                />
                <StatCard
                    title="Marketplace"
                    value={stats.marketplaceItems}
                    icon={<ShoppingCart color="#0f172a" size={24} />}
                    onPress={() => navigation.navigate('MarketplaceItems')}
                />
                <StatCard
                    title="Messages"
                    value={stats.messages}
                    subtitle="Non lus"
                    icon={<MessageSquare color="#0f172a" size={24} />}
                    onPress={() => navigation.navigate('Messages')}
                />
            </View>

            <View style={styles.quickActions}>
                <Text style={styles.sectionTitle}>Actions Rapides</Text>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddArticle')}>
                    <Text style={styles.actionButtonText}>+ Nouvel Article</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddProject')}>
                    <Text style={styles.actionButtonText}>+ Nouveau Projet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddService')}>
                    <Text style={styles.actionButtonText}>+ Nouveau Service</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddTechnology')}>
                    <Text style={styles.actionButtonText}>+ Nouvelle Technologie</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddTestimonial')}>
                    <Text style={styles.actionButtonText}>+ Nouveau Témoignage</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddMarketplaceItem')}>
                    <Text style={styles.actionButtonText}>+ Nouvel Article Marketplace</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const StatCard = ({ title, value, icon, subtitle = null, onPress }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
        <View style={styles.statHeader}>
            {icon}
            <Text style={styles.statValue}>{value}</Text>
        </View>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    contentContainer: {
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    welcome: {
        color: '#64748b',
        fontSize: 16,
    },
    name: {
        color: '#0f172a',
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: 10,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#ffffff',
        width: '48%',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 16,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        color: '#0f172a',
        fontSize: 28,
        fontWeight: 'bold',
    },
    statTitle: {
        color: '#334155',
        fontSize: 14,
        fontWeight: '600',
    },
    statSubtitle: {
        color: '#64748b',
        fontSize: 12,
        marginTop: 2,
    },
    quickActions: {
        marginTop: 20,
        marginBottom: 40,
    },
    sectionTitle: {
        color: '#0f172a',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    actionButton: {
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    actionButtonText: {
        color: '#334155',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default DashboardScreen;
