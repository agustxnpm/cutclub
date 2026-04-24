package com.cutclub.api.domain.exception;

public class CodigoReferidoInvalidoException extends RuntimeException {

    public CodigoReferidoInvalidoException(String codigo) {
        super("El código de referido no corresponde a ningún cliente: " + codigo);
    }
}
