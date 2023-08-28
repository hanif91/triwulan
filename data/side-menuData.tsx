import { SideMenu } from "@/types/menu";

const SideMenuData: SideMenu[] = [
  {
    id: 1,
    title: "Neraca",
    path: "/neraca",
    href : "home",
    iconsid : 0,
    newTab: false,
  },
  {
    id: 2,
    title: "Laba Rugi",
    path: "/labarugi",
    href : "profile",
    iconsid : 1,
    newTab: false
  },
  {
    id: 3,
    title: "Arus Kas",
    path: "/aruskas",
    href : "Pelayanan",
    iconsid : 2,
    newTab: false,
  },
  {
    id: 4,
    title: "Rincina Biaya",
    path: "/rincianbiaya",
    href : "Rincina Biaya",
    iconsid : 3,
    newTab: false,
  }
];
export default SideMenuData;
