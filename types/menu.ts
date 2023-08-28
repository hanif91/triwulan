export type Menu = {
  id: number;
  title: string;
  path?: string;
  href? : string;
  newTab: boolean;
  submenu?: Menu[] ;
};

export type SubMenuSide = {
  id: number;
  title: string;
  path?: string;
  href? : string;
  newTab: boolean;
  iconsid: number;
  submenu?: Menu[] ;
};


export type SideMenu = {
  id: number;
  title: string;
  path?: string;
  href? : string;
  newTab: boolean;
  iconsid: number;
  submenu?: SubMenuSide[] ;
};

