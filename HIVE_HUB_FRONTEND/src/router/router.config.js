import {
  AccountBoxOutlined,
  CampaignOutlined,
  Dashboard,
  DataObject,
  DesignServicesRounded,
  Explore,
  HomeOutlined,
  LocalMallOutlined,
  LocalOffer,
  LocalOfferOutlined,
  NotificationsOutlined,
  SettingsOutlined,
  Storefront,
  WebOutlined,
} from "@mui/icons-material";
import { SUPER_ADMIN, STORE_OWNER } from "../constant/LookupConst.js";
import asyncComponent from "../utils/asyncComponent.jsx";
import React from "react";

export const authRouters = [
  {
    path: "/",
    component: asyncComponent(() => import("../pages/homePage.jsx")),
    isLayout: false,
    showInMenu: false,
  },
  {
    path: "/auth/signin",
    component: asyncComponent(() => import("../pages/auth/signin/index.jsx")),
    isLayout: false,
    showInMenu: false,
  },
  {
    path: "/auth/signup",
    component: asyncComponent(() => import("../pages/auth/signup/index.jsx")),
    isLayout: false,
    showInMenu: false,
  },
];

export const appRouters = [
  {
    title: "Home",
    role: [SUPER_ADMIN, STORE_OWNER],
    icon: React.createElement(HomeOutlined),
    isLayout: true,
    showInMenu: true,
  },
  {
    path: "/admin/dashboard",
    role: [SUPER_ADMIN],
    title: "Dashboard",
    icon: React.createElement(Dashboard),
    component: asyncComponent(() =>
      import("../pages/admin/dashboard/index.jsx")
    ),
    isLayout: true,
    showInMenu: true,
  },
  {
    path: "/admin/manage-plans",
    role: [SUPER_ADMIN],
    title: "Manage Plans",
    icon: React.createElement(LocalOffer),
    component: asyncComponent(() => import("../pages/admin/plans/index.jsx")),
    isLayout: true,
    showInMenu: true,
  },
  {
    path: "/admin/manage-invite",
    role: [SUPER_ADMIN],
    title: "Manage Invite",
    icon: React.createElement(AccountBoxOutlined),
    component: asyncComponent(() =>
      import("../pages/admin/mangeInvite/index.jsx")
    ),
    isLayout: true,
    showInMenu: true,
  },
  {
    path: "/admin/invite-new-user",
    role: [SUPER_ADMIN],
    title: "Create Invite",
    icon: React.createElement(DataObject),
    component: asyncComponent(() =>
      import("../pages/admin/mangeInvite/createInvite.jsx")
    ),
    isLayout: true,
  },
  {
    path: "/admin/manage-stores",
    role: [SUPER_ADMIN],
    title: "Manage Stores",
    icon: React.createElement(Storefront),
    component: asyncComponent(() => import("../pages/admin/store/index.jsx")),
    isLayout: true,
    showInMenu: true,
  },
  {
    path: "/admin/community",
    role: [SUPER_ADMIN],
    title: "Community",
    icon: React.createElement(Explore),
    component: asyncComponent(() =>
      import("../pages/admin/community/index.jsx")
    ),
    isLayout: true,
    showInMenu: true,
  },
  {
    path: "/user/dashboard",
    role: [STORE_OWNER],
    title: "Dashboard",
    icon: React.createElement(Dashboard),
    component: asyncComponent(() =>
      import("../pages/user/dashboard/index.jsx")
    ),
    isLayout: true,
    showInMenu: true,
  },
  {
    path: "/user/home/create-store/editor",
    role: [STORE_OWNER],
    icon: React.createElement(DesignServicesRounded),
    component: asyncComponent(() =>
      import("../pages/user/createStore/createStore.jsx")
    ),
    isLayout: false,
  },
  {
    path: "/user/community",
    role: [STORE_OWNER],
    title: "Community",
    icon: React.createElement(Explore),
    component: asyncComponent(() =>
      import("../pages/user/community/index.jsx")
    ),
    isLayout: true,
    showInMenu: true,
  },
  {
    path: "/user/campaigns",
    role: [STORE_OWNER],
    title: "Campaigns",
    icon: React.createElement(CampaignOutlined),
    component: asyncComponent(() =>
      import("../pages/user/campaigns/index.jsx")
    ),
    isLayout: true,
    showInMenu: true,
  },
  {
    role: [STORE_OWNER],
    title: "Manage Store",
    icon: React.createElement(Storefront),
    isLayout: true,
    showInMenu: true,
    subMenu: true,
  },
  {
    path: "/user/manage-store/create-store",
    role: [STORE_OWNER],
    icon: React.createElement(DesignServicesRounded),
    component: asyncComponent(() =>
      import("../pages/user/createStore/index.jsx")
    ),
    isLayout: true,
  },
  {
    path: "/user/manage-store/:type/:template/:storeId",
    role: [STORE_OWNER],
    icon: React.createElement(DesignServicesRounded),
    component: asyncComponent(() =>
      import("../pages/user/createStore/createStore.jsx")
    ),
    isLayout: false,
  },
  {
    path: "/user/manage-store/:type/:template/:storeId/:phn_token",
    role: [STORE_OWNER],
    icon: React.createElement(DesignServicesRounded),
    component: asyncComponent(() =>
      import("../pages/user/createStore/createStore.jsx")
    ),
    isLayout: false,
  },
  {
    path: "/user/manage-store/inventory",
    role: [STORE_OWNER],
    icon: React.createElement(DesignServicesRounded),
    component: asyncComponent(() =>
      import("../pages/user/stores/inventory.jsx")
    ),
    isLayout: true,
  },
  {
    path: "/user/manage-store/my-store",
    role: [STORE_OWNER],
    title: "My Store",
    subMenuTitle: "Manage Store",
    icon: React.createElement(WebOutlined),
    component: asyncComponent(() => import("../pages/user/stores/index.jsx")),
    isLayout: true,
    showInSubMenu: true,
    subscriptionRequired: true,
  },
  {
    path: "/user/manage-store/products",
    role: [STORE_OWNER],
    title: "Products",
    subMenuTitle: "Manage Store",
    icon: React.createElement(LocalOfferOutlined),
    component: asyncComponent(() => import("../pages/user/stores/product.jsx")),
    isLayout: true,
    showInSubMenu: true,
  },
  {
    path: "/user/manage-store/orders",
    role: [STORE_OWNER],
    title: "Orders",
    subMenuTitle: "Manage Store",
    icon: React.createElement(LocalMallOutlined),
    component: asyncComponent(() => import("../pages/user/stores/orders.jsx")),
    isLayout: true,
    showInSubMenu: true,
  },
  {
    path: "/user/notifications",
    role: [STORE_OWNER],
    title: "Notification",
    icon: React.createElement(NotificationsOutlined),

    component: asyncComponent(() =>
      import("../pages/user/notification/index.jsx")
    ),
    isLayout: true,
    showInMenu: true,
  },
  {
    path: "/admin/settings",
    role: [SUPER_ADMIN],
    title: "Settings",
    icon: React.createElement(SettingsOutlined),
    component: asyncComponent(() =>
      import("../pages/admin/settings/index.jsx")
    ),
    isLayout: true,
    showInMenu: true,
  },
  {
    path: "/user/settings",
    role: [STORE_OWNER],
    title: "Settings",
    icon: React.createElement(SettingsOutlined),
    component: asyncComponent(() => import("../pages/user/settings/index.jsx")),
    isLayout: true,
    showInMenu: true,
  },
  {
    path: "/subscription/payment",
    role: [STORE_OWNER],
    component: asyncComponent(() =>
      import("../pages/subscription/payments.jsx")
    ),
    isLayout: true,
    showInMenu: false,
  },
  {
    path: "/subscription/plans",
    role: [STORE_OWNER],
    component: asyncComponent(() => import("../pages/subscription/plans.jsx")),
    isLayout: true,
    showInMenu: false,
  },
];

export const routers = [...authRouters, ...appRouters];
