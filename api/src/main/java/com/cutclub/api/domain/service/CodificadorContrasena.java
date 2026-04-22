package com.cutclub.api.domain.service;

public interface CodificadorContrasena {

    String codificar(String contrasenaPlana);

    boolean verificar(String contrasenaPlana, String contrasenaHash);
}
