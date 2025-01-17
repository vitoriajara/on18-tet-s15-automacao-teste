const mongoose = require('mongoose');
const PacienteSchema = require('../models/clinicaModel');
const verificarItens = require('../utils/servico')

const criarPaciente = async (request, response) => {
    const { nome, telefone, endereco, plano_saude, plano_saude_numero } =
      request.body;
    if (verificarItens.verificarItensObrigatorios(request.body)) {
      return response.json({
        message: verificarItens.verificarItensObrigatorios(request.body),
      });
    }
    if (verificarItens.validarPlanoDeSaude(request.body)) {
      return response.json({
        message: verificarItens.validarPlanoDeSaude(request.body),
      });
    }
    const buscaNumeroPlano = await PacienteSchema.find({ plano_saude_numero });
    if (buscaNumeroPlano.length !== 0) {
      return response
        .status(401)
        .json({
          message: `Não é possível cadastrar esse número de plano novamente.`,
        });
    }
    try {
      const paciente = new PacienteSchema({
        nome: nome.toUpperCase(),
        telefone: telefone.toUpperCase(),
        endereco: endereco.toUpperCase(),
        plano_saude: plano_saude.toUpperCase(),
        plano_saude_numero: plano_saude_numero,
      });
      const salvarPaciente = await paciente.save();
      response.status(201).json({
        message: `Paciente cadastrado com sucesso!`,
        paciente: salvarPaciente,
      });
    } catch (error) {
      response.status(400).json({
        message: error.message,
      });
    }
  };


const buscarTodosPacientes = async (request, response) => {
    try {
      const paciente = await PacienteSchema.find();
      if (paciente.length > 1) {
        return response
          .status(200)
          .json({
            message: "Pacientes carregados com sucesso!",
            paciente,
          });
      } else if (paciente.length == 1) {
        return response
          .status(200)
          .json({
            message: "Pacientes carregados com sucesso!",
            paciente,
          });
      } else {
        return response
          .status(200)
          .json({ message: `Nenhum paciente encontrado.` });
      }
    } catch (error) {
      response.status(500).json({
        message: error.message,
      });
    }
  };

const buscarPacienteId = async (request, response) => {
    const { id } = request.params;
    try {
      if (id.length > 24) {
        return response.status(404).json({
          Alerta: `Por favor digite o id do paciente corretamente, o mesmo possui 24 caracteres. Caracter a mais: ${
            id.length - 24
          }.`,
        });
      }
      if (id.length < 24) {
        return response.status(404).json({
          Alerta: `Por favor digite o id do paciente corretamente, o mesmo possui 24 caracteres. Caracter a menos: ${
            24 - id.length
          }.`,
        });
      }
      const paciente = await PacienteSchema.find({ id });
      if (paciente.length == 0) {
        return response
          .status(200)
          .json({ message: `O paciente não foi encontrado.` });
      }
      response
        .status(200)
        .json({ Prezades: `Segue o paciente para este id [${id}]:`, paciente });
    } catch (error) {
      response.status(500).json({
        message: error.message,
      });
    }
  };
  const atualizarPaciente = async (request, response) => {
    const { id } = request.params;
    const { nome, telefone, endereco, plano_saude, plano_saude_numero } =
      request.body;
    try {
      if (id.length > 24) {
        return response.status(404).json({
          Alerta: `Por favor digite o id do paciente corretamente, o mesmo possui 24 caracteres. Caracter a mais: ${
            id.length - 24
          }.`,
        });
      }
      if (id.length < 24) {
        return response.status(404).json({
          Alerta: `Por favor digite o id do paciente corretamente, o mesmo possui 24 caracteres. Caracter a menos: ${
            24 - id.length
          }.`,
        });
      }
      const pacienteEncontrado = await PacienteSchema.updateOne({
        nome,
        telefone,
        endereco,
        plano_saude,
        plano_saude_numero,
      });
      const pacienteAtualizado = await PacienteSchema.find({ id });
      if (pacienteAtualizado.length == 0) {
        return response.status(404).json({
          message: `O paciente não foi encontrado.`,
        });
      }
      response.json({ pacienteAtualizado });
    } catch (error) {
      response.status(500).json({
        message: error.message,
      });
    }
  };
  const deletarPaciente = async (request, response) => {
    const { id } = request.params;
    try {
      if (id.length > 24) {
        return response.status(404).json({
          Alerta: `Por favor digite o id do paciente corretamente, o mesmo possui 24 caracteres. Caracter a mais: ${
            id.length - 24
          }.`,
        });
      }
      if (id.length < 24) {
        return response.status(404).json({
          Alerta: `Por favor digite o id do paciente corretamente, o mesmo possui 24 caracteres. Caracter a menos: ${
            24 - id.length
          }.`,
        });
      }
      const pacienteEncontrado = await PacienteSchema.deleteOne({ id });
      if (pacienteEncontrado.deletedCount === 1) {
        return response
          .status(200)
          .send({ message: `O paciente foi deletado com sucesso!` });
      } else {
        return response
          .status(404)
          .send({ message: "O paciente não foi encontrado." });
      }
    } catch (error) {
      response.status(500).json({
        message: error.message,
      });
    }
  };
module.exports = {
    criarPaciente,
    buscarTodosPacientes,
    buscarPacienteId,
    atualizarPaciente,
    deletarPaciente
}