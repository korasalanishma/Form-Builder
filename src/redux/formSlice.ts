import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Field {
  id: number;
  type: string;
  label: string;
  required: boolean;
  defaultValue: string;
  options?: string[];
  derived?: boolean;
  parentIds?: number[];
  operation?: "sum" | "subtract" | "concat" | "age";
}

interface FormData {
  formName: string;
  createdAt: string;
  fields: Field[];
}

interface FormState {
  forms: FormData[];
  selectedForm: FormData | null;
}

const initialState: FormState = {
  forms: [],
  selectedForm: null,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addForm: (state, action: PayloadAction<FormData>) => {
      state.forms.push(action.payload);
    },
    setSelectedForm: (state, action: PayloadAction<FormData>) => {
      state.selectedForm = action.payload;
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.forms = state.forms.filter(
        (form) => form.formName !== action.payload
      );
    },
  },
});

export const { addForm, setSelectedForm, deleteForm } = formSlice.actions;
export default formSlice.reducer;
