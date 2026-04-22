package com.cutclub.api.domain.exception;

public class ClienteYaExisteException extends RuntimeException {

    public ClienteYaExisteException(String mensaje) {
        super(mensaje);
    }
}
