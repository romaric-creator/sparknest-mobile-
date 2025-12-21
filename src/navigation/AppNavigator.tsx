import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ArticlesScreen from '../screens/ArticlesScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import AddArticleScreen from '../screens/AddArticleScreen';
import AddProjectScreen from '../screens/AddProjectScreen';

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
                name="AddArticle"
                component={AddArticleScreen}
                options={{ title: 'Nouvel Article' }}
            />
            <Stack.Screen
                name="AddProject"
                component={AddProjectScreen}
                options={{ title: 'Nouveau Projet' }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
