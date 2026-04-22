package com.cutclub.api.domain.exception;

/**
 * Excepción lanzada cuando no se encuentra un cliente por su identificador.
 */
public class ClienteNoEncontradoException extends RuntimeException {

    public ClienteNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
