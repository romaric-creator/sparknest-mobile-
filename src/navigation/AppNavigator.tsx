import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ArticlesScreen from '../screens/ArticlesScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import AddArticleScreen from '../screens/AddArticleScreen';
import AddProjectScreen from '../screens/AddProjectScreen';
import AddServiceScreen from '../screens/AddServiceScreen';
import ServicesScreen from '../screens/ServicesScreen';
import AddTechnologyScreen from '../screens/AddTechnologyScreen';
import TechnologiesScreen from '../screens/TechnologiesScreen';
import AddTestimonialScreen from '../screens/AddTestimonialScreen';
import TestimonialsScreen from '../screens/TestimonialsScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MarketplaceItemsScreen from '../screens/MarketplaceItemsScreen';
import AddMarketplaceItemScreen from '../screens/AddMarketplaceItemScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator
            id="root-stack"
            initialRouteName="Login"
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#0f172a',
                    borderBottomWidth: 1,
                    borderBottomColor: '#1e293b',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ title: 'Tableau de bord' }}
            />
            <Stack.Screen
                name="Articles"
                component={ArticlesScreen}
                options={{ title: 'Articles' }}
            />
            <Stack.Screen
                name="Messages"
                component={MessagesScreen}
                options={{ title: 'Messages' }}
            />
            <Stack.Screen
                name="Projects"
                component={ProjectsScreen}
                options={{ title: 'Projets' }}
            />
            <Stack.Screen
                name="Services"
                component={ServicesScreen}
                options={{ title: 'Gérer les Services' }}
            />
            <Stack.Screen
                name="Technologies"
                component={TechnologiesScreen}
                options={{ title: 'Gérer les Technologies' }}
            />
            <Stack.Screen
                name="Testimonials"
                component={TestimonialsScreen}
                options={{ title: 'Gérer les Témoignages' }}
            />
            <Stack.Screen
                name="MarketplaceItems"
                component={MarketplaceItemsScreen}
                options={{ title: 'Gérer la Marketplace' }}
            />
            <Stack.Screen
                name="AddArticle"
                component={AddArticleScreen}
                options={{ title: 'Nouvel Article' }}
            />
            <Stack.Screen
                name="AddProject"
                component={AddProjectScreen}
                options={{ title: 'Nouveau Projet' }}
            />
            <Stack.Screen
                name="AddService"
                component={AddServiceScreen}
                options={{ title: 'Nouveau Service' }}
            />
            <Stack.Screen
                name="AddTechnology"
                component={AddTechnologyScreen}
                options={{ title: 'Nouvelle Technologie' }}
            />
            <Stack.Screen
                name="AddTestimonial"
                component={AddTestimonialScreen}
                options={{ title: 'Nouveau Témoignage' }}
            />
            <Stack.Screen
                name="AddMarketplaceItem"
                component={AddMarketplaceItemScreen}
                options={{ title: 'Nouvel Article Marketplace' }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
