// data.ts
export type MenuItem = {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
};

export type Menu = {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
};


export const menuItems: MenuItem[] = [
  {
    id: "region",
    label: "Region",
    children: [
      { id: 11, label: "Ahafo" },
      { id: 12, label: "Ashanti" },
      { id: 13, label: "Bono" },
      { id: 14, label: "Bono East" },
      { id: 15, label: "Central" },
      { id: 16, label: "Eastern" },
      { id: 17, label: "Greater Accra" },
      { id: 18, label: "North East" },
      { id: 19, label: "Northern" },
      { id: 20, label: "Oti" },
      { id: 21, label: "Savannah" },
      { id: 22, label: "Upper East" },
      { id: 23, label: "Upper West" },
      { id: 24, label: "Volta" },
      { id: 25, label: "Western" },
      { id: 26, label: "Western North" },
    ],
  },
  {
    id: "road_type",
    label: "Road Type",
    children: [
      { id: 31, label: "Highway" },
      { id: 32, label: "Arterial" },
      { id: 33, label: "Collector" },
      { id: 34, label: "Local" },
    ],
  },
  {
    id: "surface_type",
    label: "Surface Type",
    children: [
      { id: 41, label: "Asphalt" },
      { id: 42, label: "Gravel" },
      { id: 43, label: "Earth" },
      { id: 44, label: "Paved Concrete" },
    ],
  },
  {
    id: "condition",
    label: "Condition",
    children: [
      { id: 51, label: "Good" },
      { id: 52, label: "Fair" },
      { id: 53, label: "Poor" },
    ],
  },
];