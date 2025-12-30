import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the parameter list for each screen in your stack navigator
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Articles: undefined;
  Messages: undefined;
  Projects: undefined;
  Services: undefined;
  Technologies: undefined;
  Testimonials: undefined;
  MarketplaceItems: undefined;
  AddArticle: undefined;
  AddProject: undefined;
  AddService: undefined;
  AddTechnology: undefined;
  AddTestimonial: undefined;
  AddMarketplaceItem: undefined;
  // Assuming EditArticle takes an article object
  EditArticle: { article: any }; // Use 'any' for now, or define a specific type if available
  // Add other screens and their parameters here
};

// Define the navigation prop type for screens
export type RootStackNavigationProp<RouteName extends keyof RootStackParamList> = StackNavigationProp<
  RootStackParamList,
  RouteName
>;

// Define the route prop type for screens
export type RootStackRouteProp<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;

// Extend React Navigation's types
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
