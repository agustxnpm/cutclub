package com.cutclub.api.infrastructure.adapter.service;

import com.cutclub.api.domain.service.CodigoReferidoGenerator;

import java.security.SecureRandom;

/**
 * Implementación de infraestructura para la generación de códigos de referido.
 *
 * Genera códigos alfanuméricos de 6 caracteres usando SecureRandom
 * para evitar predictibilidad en los códigos asignados a clientes.
 */
public class CodigoReferidoGeneratorImpl implements CodigoReferidoGenerator {

    private static final String CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int LONGITUD_CODIGO = 6;
    private final SecureRandom random = new SecureRandom();

    @Override
    public String generarCodigo() {
        StringBuilder codigo = new StringBuilder(LONGITUD_CODIGO);
        for (int i = 0; i < LONGITUD_CODIGO; i++) {
            codigo.append(CARACTERES.charAt(random.nextInt(CARACTERES.length())));
        }
        return codigo.toString();
    }
}
