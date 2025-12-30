import React, { useEffect, useState, useCallback } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator, 
    RefreshControl,
    StatusBar,
    Dimensions
} from 'react-native';
import { adminService, authService } from '../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from '../components/Icon';
import { RootStackNavigationProp } from '../types/navigation'; // Import the type

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp<'Dashboard'>>(); // Type the navigation hook
    const [stats, setStats] = useState({ 
        articles: 0, projects: 0, messages: 0, services: 0, 
        technologies: 0, testimonials: 0, marketplaceItems: 0 
    });
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
            console.error('Dash load error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(useCallback(() => { loadData(); }, []));

    const onRefresh = () => { setRefreshing(true); loadData(); };

    const handleLogout = async () => {
        await authService.logout();
        navigation.replace('Login');
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6366F1" />
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container} 
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />}
        >
            <StatusBar barStyle="dark-content" />
            
            {/* Top Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Tableau de bord</Text>
                    <Text style={styles.userName}>Ravi de vous revoir, {user?.name?.split(' ')[0] || 'Admin'} 👋</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Icon name="LogOut" color="#EF4444" size={20} />
                </TouchableOpacity>
            </View>

            {/* Alert Messages (S'il y a des messages non lus) */}
            {stats.messages > 0 && (
                <TouchableOpacity 
                    style={styles.alertBanner} 
                    onPress={() => navigation.navigate('Messages')}
                >
                    <Icon name="Mail" color="#FFF" size={18} />
                    <Text style={styles.alertText}>Vous avez {stats.messages} nouveau{stats.messages > 1 ? 's' : ''} message{stats.messages > 1 ? 's' : ''}</Text>
                    <Icon name="ChevronRight" color="#FFF" size={16} />
                </TouchableOpacity>
            )}

            {/* Stats Grid */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Statistiques</Text>
            </View>
            <View style={styles.grid}>
                <StatCard 
                    label="Articles" count={stats.articles} icon="FileText" color="#6366F1"
                    onPress={() => navigation.navigate('Articles')} 
                />
                <StatCard 
                    label="Projets" count={stats.projects} icon="Briefcase" color="#10B981"
                    onPress={() => navigation.navigate('Projects')} 
                />
                <StatCard 
                    label="Shop" count={stats.marketplaceItems} icon="ShoppingCart" color="#F59E0B"
                    onPress={() => navigation.navigate('MarketplaceItems')} 
                />
                <StatCard 
                    label="Reviews" count={stats.testimonials} icon="Star" color="#EC4899"
                    onPress={() => navigation.navigate('Testimonials')} 
                />
            </View>

            {/* Quick Actions */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Création Rapide</Text>
            </View>
            <View style={styles.actionsContainer}>
                <ActionButton label="Article" icon="Plus" color="#6366F1" onPress={() => navigation.navigate('AddArticle')} />
                <ActionButton label="Projet" icon="Plus" color="#10B981" onPress={() => navigation.navigate('AddProject')} />
                <ActionButton label="Service" icon="Plus" color="#0EA5E9" onPress={() => navigation.navigate('AddService')} />
                <ActionButton label="Tech" icon="Plus" color="#8B5CF6" onPress={() => navigation.navigate('AddTechnology')} />
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

/* Composant Interne: Carte de Stat */
const StatCard = ({ label, count, icon, color, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
            <Icon name={icon} color={color} size={22} />
        </View>
        <Text style={styles.cardCount}>{count}</Text>
        <Text style={styles.cardLabel}>{label}</Text>
    </TouchableOpacity>
);

/* Composant Interne: Bouton d'action */
const ActionButton = ({ label, icon, color, onPress }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
        <View style={[styles.actionIconCircle, { backgroundColor: color }]}>
            <Icon name={icon} color="#FFF" size={16} />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { 
        paddingHorizontal: 24, 
        paddingTop: 60, 
        paddingBottom: 25, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    welcomeText: { fontSize: 14, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 },
    userName: { fontSize: 22, fontWeight: '900', color: '#0F172A', marginTop: 4 },
    logoutBtn: { backgroundColor: '#FEF2F2', padding: 10, borderRadius: 12 },
    
    alertBanner: {
        margin: 20,
        backgroundColor: '#0F172A',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    alertText: { flex: 1, color: '#FFF', fontWeight: '700', marginLeft: 12, fontSize: 14 },

    sectionHeader: { paddingHorizontal: 24, marginTop: 10, marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },

    grid: { 
        paddingHorizontal: 16, 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between' 
    },
    card: {
        backgroundColor: '#FFF',
        width: (width / 2) - 24,
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },
    iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    cardCount: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
    cardLabel: { fontSize: 13, fontWeight: '600', color: '#64748B', marginTop: 2 },

    actionsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 24 
    },
    actionItem: { alignItems: 'center', width: (width - 48) / 4 },
    actionIconCircle: { 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3
    },
    actionLabel: { fontSize: 11, fontWeight: '700', color: '#475569' }
});

export default DashboardScreen;