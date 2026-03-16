package com.cutclub.api.domain.service;

/**
 * Servicio de dominio para la generación de códigos de referido.
 *
 * Define el contrato para generar códigos alfanuméricos de 6 caracteres
 * que se asignan a cada cliente como identificador de referido.
 *
 * La implementación concreta se proveerá en la capa de infraestructura,
 * respetando la inversión de dependencias de la Arquitectura Hexagonal.
 */
public interface CodigoReferidoGenerator {

    /**
     * Genera un código de referido alfanumérico de 6 caracteres.
     *
     * @return código de referido único
     */
    String generarCodigo();
}
