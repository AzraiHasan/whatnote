import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useSupabaseClient } from "#supabase/client";

export const useStoreNotes = defineStore("storeNotes", {
  state: () => ({
    notes: ref([]),
  }),
  actions: {
    addNote(newNote) {
      let currentDate = new Date().getTime(),
        id = currentDate.toString();

      let note = {
        id,
        note: newNote,
      };

      this.notes.unshift(note);
    },
    deleteNote(idToDelete) {
      console.log(idToDelete, "is deleted");
      this.notes = this.notes.filter((note) => note.id !== idToDelete);
    },
    updateNote(id, note) {
      console.log(id, note);

      let index = this.notes.findIndex((note) => note.id === id);
      if (index !== -1) {
        this.notes[index].note = note;
      }
    },
    async saveNotesToSupabase() {
      const supabase = useSupabaseClient();

      try {
        const { data, error } = await supabase.from("notes").upsert(
          this.notes.map((note) => ({
            id: note.id,
            content: note.note,
          }))
        );

        if (error) throw error;
        console.log("Notes saved successfully");
      } catch (error) {
        console.error("Error saving notes:", error);
      }
    },
  },
  getters: {
    editNote: (state) => {
      return (id) => {
        console.log(id, "from routes.params.id");
        return state.notes.filter((note) => note.id === id)[0]?.note;
      };
    },
  },
  persist: true,
});
