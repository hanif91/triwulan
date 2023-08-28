import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    href : "home",
    newTab: false,
  },
  {
    id: 2,
    title: "Profile",
    newTab: false,
    href : "profile",
    submenu: [
      {
        id: 21,
        title: "Tentang Kami",
        path: "/tentang",
        href : "tentang",
        newTab: false,
      },
      {
        id: 22,
        title: "Struktur Organisasi",
        path: "/",
        href : "struktur",
        newTab: false,
      }
    ]
  },
  {
    id: 3,
    title: "Pelayanan",
    newTab: false,
    href : "Pelayanan",
    submenu: [
      {
        id: 31,
        title: "Pasang Baru",
        path: "/tentang",
        href : "pasangbaru",
        newTab: false,
      },
      {
        id: 32,
        title: "Pengaduan Pelanggan",
        path: "/",
        href : "struktur",
        newTab: false,
      },
      {
        id: 33,
        title: "Pengaduan Non Pelanggan",
        path: "/",
        href : "pengaduan",
        newTab: false,
      },
      {
        id: 34,
        title: "Cek Tagihan",
        path: "/",
        href : "cektagihan",
        newTab: false,
      },
      {
        id: 35,
        title: "Bacameter Mandiri",
        path: "/",
        href : "struktur",
        newTab: false
      }
    ]
  },
  {
    id: 4,
    title: "Berita",
    path: "/",
    href : "Berita",
    newTab: false,
  },
  {
    id: 5,
    title: "Dokumen Publik",
    path: "/public-doc",
    href : "publicdoc",
    newTab: false,
  },
  {
    id: 6,
    title: "Kontak Kami",
    path: "/contact",
    href : "contact",
    newTab: false,
  },
];
export default menuData;
