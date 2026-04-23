package com.cutclub.api.domain.model;

/**
 * Tipo de beneficio otorgado a un cliente de la barbería.
 * - FIDELIZACION: generado automáticamente al completar el ciclo de cortes (4+1).
 * - REFERIDO: generado cuando el barbero valida que el referido es un cliente nuevo.
 */
public enum TipoBeneficio {
    FIDELIZACION,
    REFERIDO
}
