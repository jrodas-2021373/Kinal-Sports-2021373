import { create } from 'zustand';
import {
  getFields as getFieldsRequest,
  createField as createFieldRequest,
  updateField as updateFieldRequest,
  deleteField as deleteFieldRequest,
} from '../../../shared/apis';

export const useFieldsStore = create((set, get) => ({
  fields: [],
  loading: false,
  error: null,

  getFields: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getFieldsRequest();

      set({
        fields: response.data.data,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al listar canchas',
        loading: false,
      });
    }
  },

  createField: async (formData) => {
    try {
      set({ loading: true, error: null });
      const response = await createFieldRequest(formData);

      set({
        fields: [response.data.data, ...get().Fields()],
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Error al crear la cancha',
      });
    }
  },

  updateField: async (id, formData) => {
    try {
      set({ loading: true, error: null });
      const response = await updateFieldRequest(id, formData);
      set({
        fields: get().fields.map((fieldId) => (field._id === id ? response.data.data : field)),
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Error al actualizar la cancha',
      });
    }
  },

  deleteField: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteFieldRequest(id);
      set({
        fields: get().filter((field) => field._id !== id),
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Error al eliminar la cancha',
      });
    }
  },
}));
