import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import PolicyList from "@/pages/PolicyList";
import PolicyDetail from "@/pages/PolicyDetail";
import Assessment from "@/pages/Assessment";
import Favorites from "@/pages/Favorites";
import FAQ from "@/pages/FAQ";
import Articles from "@/pages/Articles";
import Applications from "@/pages/Applications";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Subscriptions from "@/pages/Subscriptions";
import Notifications from "@/pages/Notifications";
import PolicyCompare from "@/pages/PolicyCompare";
import Admin from "@/pages/Admin";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/policies" element={<PolicyList />} />
          <Route path="/policies/:id" element={<PolicyDetail />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/compare" element={<PolicyCompare />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
