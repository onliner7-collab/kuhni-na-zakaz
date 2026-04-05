import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { CatalogPage, CatalogItemPage } from "@/pages/CatalogPage";
import { PortfolioPage, PortfolioItemPage } from "@/pages/PortfolioPage";
import { PricesPage } from "@/pages/PricesPage";
import { ReviewsPage } from "@/pages/ReviewsPage";
import { BlogPage, BlogPostPage } from "@/pages/BlogPage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactsPage } from "@/pages/ContactsPage";
import { LocationPage } from "@/pages/LocationPage";
import { DeliveryPage } from "@/pages/DeliveryPage";
import { WarrantyPage } from "@/pages/WarrantyPage";
import { ThanksPage } from "@/pages/ThanksPage";
import { PrivacyPolicyPage, TermsPage, PersonalDataPage } from "@/pages/LegalPages";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

const StylesPlaceholder = () => (
  <div className="container mx-auto px-4 py-12">
    <nav className="text-sm text-muted-foreground mb-8">
      <span>Главная / Стили кухонь</span>
    </nav>
    <h1 className="text-4xl font-bold font-serif mb-4">Стили кухонь на заказ</h1>
    <p className="text-muted-foreground">Современные, классические, скандинавские, минимализм, лофт — выберите стиль под ваш интерьер.</p>
  </div>
);

const MaterialsPlaceholder = () => (
  <div className="container mx-auto px-4 py-12">
    <nav className="text-sm text-muted-foreground mb-8">
      <span>Главная / Материалы</span>
    </nav>
    <h1 className="text-4xl font-bold font-serif mb-4">Материалы и фасады для кухонь</h1>
    <p className="text-muted-foreground">МДФ, пластик, эмаль, шпон, EGGER — сравниваем материалы честно.</p>
  </div>
);

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/catalog" component={CatalogPage} />
        <Route path="/catalog/:category" component={CatalogItemPage} />
        <Route path="/styles" component={StylesPlaceholder} />
        <Route path="/styles/:slug" component={StylesPlaceholder} />
        <Route path="/materials" component={MaterialsPlaceholder} />
        <Route path="/materials/:slug" component={MaterialsPlaceholder} />
        <Route path="/prices" component={PricesPage} />
        <Route path="/portfolio" component={PortfolioPage} />
        <Route path="/portfolio/:slug" component={PortfolioItemPage} />
        <Route path="/reviews" component={ReviewsPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/delivery-installation" component={DeliveryPage} />
        <Route path="/warranty" component={WarrantyPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/locations/:city" component={LocationPage} />
        <Route path="/contacts" component={ContactsPage} />
        <Route path="/privacy-policy" component={PrivacyPolicyPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/personal-data" component={PersonalDataPage} />
        <Route path="/thanks" component={ThanksPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
