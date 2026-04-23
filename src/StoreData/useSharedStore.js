import { create } from "zustand";

export const useSharedStore = create((set) => ({
    orderPlan: [],
    setOrderPlan: (data) => {
      console.log("Zustand setOrderPlan called with:", data);
      set({ orderPlan: data });
    },
  
    partData: [],
    setPartData: (data) => {
      console.log("Zustand setPartData called with:", data);
      set({ partData: data });
    },
  }));
  