export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stateId: string;
}

export interface StateData {
  id: string;
  name: string;
}

export const STATES: StateData[] = [
  { id: "AP", name: "Andhra Pradesh" },
  { id: "AR", name: "Arunachal Pradesh" },
  { id: "AS", name: "Assam" },
  { id: "BR", name: "Bihar" },
  { id: "CT", name: "Chhattisgarh" },
  { id: "GA", name: "Goa" },
  { id: "GJ", name: "Gujarat" },
  { id: "HR", name: "Haryana" },
  { id: "HP", name: "Himachal Pradesh" },
  { id: "JH", name: "Jharkhand" },
  { id: "KA", name: "Karnataka" },
  { id: "KL", name: "Kerala" },
  { id: "MP", name: "Madhya Pradesh" },
  { id: "MH", name: "Maharashtra" },
  { id: "MN", name: "Manipur" },
  { id: "ML", name: "Meghalaya" },
  { id: "MZ", name: "Mizoram" },
  { id: "NL", name: "Nagaland" },
  { id: "OR", name: "Odisha" },
  { id: "PB", name: "Punjab" },
  { id: "RJ", name: "Rajasthan" },
  { id: "SK", name: "Sikkim" },
  { id: "TN", name: "Tamil Nadu" },
  { id: "TG", name: "Telangana" },
  { id: "TR", name: "Tripura" },
  { id: "UP", name: "Uttar Pradesh" },
  { id: "UT", name: "Uttarakhand" },
  { id: "WB", name: "West Bengal" },
  // Union Territories could be added too
];

export const DISHES: Dish[] = [
  {
    id: "dish_1",
    name: "Chhena Poda",
    description: "A classic roasted cheese dessert from Odisha, baked to perfection with a caramelized crust.",
    price: 250,
    image: "/images/dishes/chhena-poda.png",
    stateId: "OR",
  },
  {
    id: "dish_2",
    name: "Dalma",
    description: "A nutritious and hearty lentil stew cooked with seasonal vegetables and aromatic spices.",
    price: 180,
    image: "/images/dishes/dalma.png",
    stateId: "OR",
  }
];

export const getDishesByState = (stateId: string): Dish[] => {
  return DISHES.filter(dish => dish.stateId === stateId);
};
