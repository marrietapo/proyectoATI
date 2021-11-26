
//Layouts...
import LayoutAdmin from "../layouts/LayoutAdmin";

//Admin pages...
import Admin from "../pages/Admin/Admins";
import Auth from "../pages/Auth";
import AdminUsers from "../pages/Admin/Users";
import AdminBarbershops from "../pages/Admin/Barbershops";
import AdminNotifications from "../pages/Admin/Notifications";


//Barbershop pages..
import MyBarbershop from "../pages/BarberAdmin/MyBarbershop";
import Barbers from "../pages/BarberAdmin/Barbers";
import Comments from "../pages/BarberAdmin/Comments";
import Reservations from "../pages/BarberAdmin/Reservations";
import Services from "../pages/BarberAdmin/BarbershopServices";
import CreateBarbershop from "../pages/BarberAdmin/CreateBarbershop/CreateBarbershop";
import SocialMedia from "../pages/BarberAdmin/SocialMedia/SocialMedia";

//Other
import PageNotFound from "../pages/PageNotFound";
import UploadImages from "../pages/BarberAdmin/UploadImages";




export const barbershopOwnerRoutes = [
  {
    path: "/",
    exact: false,
    component: LayoutAdmin,

    routes: [
      {
        path: "/",
        exact: true,
        component: Admin,
      },
      {
        path: "/login",
        exact: true,
        component: Auth,
      },
      {
        path: "/barbershop",
        exact: true,
        component: MyBarbershop,
      },

      {
        path: "/barbers",
        exact: true,
        component: Barbers,
      },
      {
        path: "/barbershop-images",
        exact: true,
        component: UploadImages,
      },
      {
        path: "/social-links",
        exact: true,
        component: SocialMedia,
      },
      {
        path: "/services",
        exact: true,
        component: Services,
      },
      {
        path: "/comments",
        exact: true,
        component: Comments,
      },
      {
        path: "/reservations",
        exact: true,
        component: Reservations,
      },
      {
        component: PageNotFound,
      },
    ],
  },
];

export const adminRoutes = [
  {
    path: "/",
    exact: false,
    component: LayoutAdmin,

    routes: [
      {
        path: "/",
        exact: true,
        component: Admin,
      },
      {
        path: "/login",
        exact: true,
        component: Auth,
      },
      {
        path: "/users",
        exact: true,
        component: AdminUsers,
      },
      {
        path: "/barbershops",
        exact: true,
        component: AdminBarbershops,
      },
      {
        path: "/notifications",
        exact: true,
        component: AdminNotifications,
      },
      {
        path: "/create-barbershop",
        exact: true,
        component: CreateBarbershop,
      },
      {
        component: PageNotFound,
      },
    ],
  },
];

export const routes = [
  {
    path: "/",
    exact: false,
    component: LayoutAdmin,

    routes: [
      {
        path: "/",
        exact: true,
        component: Admin,
      },
      {
        path: "/login",
        exact: true,
        component: Auth,
      },
      {
        path: "/users",
        exact: true,
        component: AdminUsers,
      },
      {
        path: "/barbershops",
        exact: true,
        component: AdminBarbershops,
      },
      {
        path: "/notifications",
        exact: true,
        component: AdminNotifications,
      },
      {
        path: "/barbershop",
        exact: true,
        component: MyBarbershop,
      },
      {
        path: "/create-barbershop",
        exact: true,
        component: CreateBarbershop,
      },
      {
        path: "/barbers",
        exact: true,
        component: Barbers,
      },
      {
        path: "/social-links",
        exact: true,
        component: SocialMedia,
      },
      {
        path: "/services",
        exact: true,
        component: Services,
      },
      {
        path: "/comments",
        exact: true,
        component: Comments,
      },
      {
        path: "/reservations",
        exact: true,
        component: Reservations,
      },
      {
        component: PageNotFound,
      },
    ],
  },
];


