package com.cutclub.api.domain.model;

/**
 * Roles de acceso del sistema.
 *
 * - BARBERO: usuario operativo del SaaS (titular o empleado de la barbería).
 * - CLIENTE: usuario final que consulta su perfil y código de referido.
 * - ADMIN: administrador de la plataforma (gestión de licencias y soporte).
 */
public enum Rol {
    BARBERO,
    CLIENTE,
    ADMIN
}
