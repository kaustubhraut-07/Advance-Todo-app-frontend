import { createSlice } from '@reduxjs/toolkit';


const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('themeState');
    if (serializedState === null) {
      return { isDarkMode: false };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { isDarkMode: false };
  }
};


const saveStateToLocalStorage = (state : any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('themeState', serializedState);
  } catch (err) {

    console.log(err);
  }
};

const initialState = loadStateFromLocalStorage();

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      saveStateToLocalStorage(state);
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      saveStateToLocalStorage(state);
    },
  },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
