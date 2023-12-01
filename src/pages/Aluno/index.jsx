import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { saveAs } from 'file-saver';

const PdfContent = React.forwardRef(({ alunoInfo }, ref) => (
  <div ref={ref}>
    <img
      id="foto"
      src="https://www.calendariodovestibular.com.br/wp-content/uploads/2013/03/post_unicap.png"
      alt="Logo"
    />
    <img
      id="foto2"
      src="https://3.bp.blogspot.com/-ZlUb7VtvlsU/XL26k8OWPoI/AAAAAAAAGH4/BXmt8JjRUBckc3GjNNwJjbI4RgJYMkfjwCLcBGAs/s640/logo-pibic.png"
      alt="Logo"
    />
    <h1 id="título">DECLARAÇÃO DE VÍNCULO</h1>

    <div id="texto">
      
      <h3>
        Por meio desta declaração, atestamos que o(a) estudante{' '}
        {alunoInfo?.nomeAluno}, regularmente matriculado(a) com o número:{' '}
        {alunoInfo?.matricula},
      </h3>
      <h3>
        está oficialmente vinculado(a) e participando ativamente do Programa
        Institucional de Bolsas de Iniciação Científica (PIBIC).
      </h3>
      <h3>
        O(a) estudante mencionado(a) encontra-se envolvido(a) no projeto de
        pesquisa intitulado "{alunoInfo?.tituloProjeto}", sob a orientação do(a)
        Professor(a) {alunoInfo?.nomeCompletoOrientador}.
      </h3>
      <h3>
        Esta participação tem o objetivo de promover o avanço do conhecimento
        na área de {alunoInfo?.cursoOrientador} e proporcionar uma
        experiência enriquecedora em pesquisa científica.
      </h3>
    </div>
    <div id="caixa">
      <h2>AUTENTICAÇÃO</h2>
      <span id="data">Recife, {new Date().toLocaleString()}</span>
      <img
        id="foto3"
        src="https://s3.online24.pt/foto/como-criar-uma-assinatura-digital-73_bg.jpg"
        alt="Logo"
      />

      <div id="assinatura">
        <span>Profº Ana Joul Pinheiro</span>
        <p>Diretora de Gestão Escolar</p>
        <p>Matº 205.87-9</p>
      </div>

      <p>
        RECONHECIDA PELO DECRETO N° 30.417, PUBLICADO NO D.O.U. DE N° 33 DE 08
        FEVEREIRO DE 1952 E
      </p>
      <p id="id">
        RECREDENCIADA PELA PORTARIA N° 2.145 - MEC, DE 12.12.2019, PUBLICADA NO
        D.O.U. N° 241, DE 13.12.2019
      </p>
    </div>
  </div>
));

const Aluno = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [alunoInfo, setAlunoInfo] = React.useState('Lucas');
  const pdfContentRef = React.useRef();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const aluno = await login(inputValue);
      setAlunoInfo(aluno);
      return aluno; // Retorna o objeto aluno para verificar se a matrícula é válida
    } catch (error) {
      console.error('Erro ao obter dados do aluno:', error);
      return null;
    }
  };

  const handlePrint = useReactToPrint({
    content: () => pdfContentRef.current,
  });

  const handleDownload = async () => {
    const aluno = await handleLogin();

    if (aluno) {
      console.log(alunoInfo);
      // Se a matrícula for válida, imprima ou baixe o PDF
      handlePrint();
      setTimeout(() => {
        const content = pdfContentRef.current;
        if (content) {
          const pdfOptions = {
            filename: 'relatorio.pdf',
          };
          content.toBlob((blob) => {
            saveAs(blob, pdfOptions.filename);
          });
        }
      }, 500);
    } else {
      // Se a matrícula não for válida, exiba uma mensagem ou tome outra ação
      console.log('Matrícula inválida. Não será gerado o PDF.');
    }
  };

  return (
    
      <div id="titulogerador">
        
        <h1>Gerador De Declaração de Vínculo (PIBIC)</h1>
        <input
          id='inputdeclaracao'
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Digite sua matrícula"
        />
        <button onClick={handleDownload}>Gerar PDF</button>
        <div style={{ display: 'none' }}>
          <PdfContent alunoInfo={alunoInfo} ref={pdfContentRef} />
        </div>
      </div>
    
  );
};

const login = async (matricula) => {
  const responseAluno = await fetch(
    'https://pibicdb.onrender.com/alunos'
  ).then((res) => res.json());

  const aluno = responseAluno.find((aluno) => aluno.matricula === matricula);
  return aluno;
};

export default Aluno;
