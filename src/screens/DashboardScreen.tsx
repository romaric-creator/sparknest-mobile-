import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { FileText, Briefcase, MessageSquare, LogOut } from 'lucide-react-native';
import { adminService, authService } from '../services/api';

const DashboardScreen = ({ navigation }) => {
    const [stats, setStats] = useState({ articles: 0, projects: 0, messages: 0 });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const userData = await authService.getUser();
            setUser(userData);

            const [articles, projects, messages] = await Promise.all([
                adminService.getArticles(),
                adminService.getProjects(),
                adminService.getMessages(),
            ]);

            setStats({
                articles: articles.data.length,
                projects: projects.data.length,
                messages: messages.data.filter(m => !m.read).length,
            });
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handleLogout = async () => {
        await authService.logout();
        navigation.replace('Login');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#22d3ee" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22d3ee" />
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
                    icon={<FileText color="#22d3ee" size={24} />}
                    onPress={() => navigation.navigate('Articles')}
                />
                <StatCard
                    title="Projets"
                    value={stats.projects}
                    icon={<Briefcase color="#22d3ee" size={24} />}
                    onPress={() => navigation.navigate('Projects')}
                />
                <StatCard
                    title="Messages"
                    value={stats.messages}
                    subtitle="Non lus"
                    icon={<MessageSquare color="#22d3ee" size={24} />}
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
        backgroundColor: '#020617',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#020617',
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
        color: '#94a3b8',
        fontSize: 16,
    },
    name: {
        color: '#fff',
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
        backgroundColor: '#0f172a',
        width: '48%',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#1e293b',
        marginBottom: 15,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    statTitle: {
        color: '#94a3b8',
        fontSize: 14,
    },
    statSubtitle: {
        color: '#22d3ee',
        fontSize: 12,
        marginTop: 2,
    },
    quickActions: {
        marginTop: 20,
        marginBottom: 40,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    actionButton: {
        backgroundColor: '#1e293b',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#334155',
    },
    actionButtonText: {
        color: '#22d3ee',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default DashboardScreen;
