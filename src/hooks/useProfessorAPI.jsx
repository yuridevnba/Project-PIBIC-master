export default function useProfessorAPI() {

    async function carregarProfessores(){
        try {
            const response = await fetch("https://pibicdb.onrender.com/professores");
            const data = await response.json();
            return data || []
          } catch (error) {
            console.error("Erro ao carregar os dados dos professores:", error);
          }
    }



    return {carregarProfessores}
}