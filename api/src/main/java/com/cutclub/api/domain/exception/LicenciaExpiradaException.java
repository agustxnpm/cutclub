package com.cutclub.api.domain.exception;

/**
 * Lanzada cuando un usuario con rol BARBERO intenta autenticarse
 * pero su licencia SaaS no se encuentra activa (ej. falta de pago).
 */
public class LicenciaExpiradaException extends RuntimeException {

    public LicenciaExpiradaException(String mensaje) {
        super(mensaje);
    }
}
