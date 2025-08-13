alter VIEW vw_personanatural
AS
	SELECT
		a.IdPersona AS IdPersona
		,a.Nombres AS Nombres
		,a.FechaIngreso AS FechaIngreso
		,a.EsEmpresa AS EsEmpresa
		,b.PrimerNombre AS PrimerNombre
		,b.SegundoNombre AS SegundoNombre
		,b.PrimerApellido AS PrimerApellido
		,b.SegundoApellido AS SegundoApellido
		,b.FechaNacimiento AS FechaNacimiento
		,c.IdPais AS IdPais
		,c.Pais AS Pais
		,c.IdDepartamento AS IdDepartamento
		,c.Departamento AS Departamento
		,c.IdProvincia AS IdProvincia
		,c.Provincia AS Provincia
		,b.IdUbigeoNacimiento AS IdUbigeoNacimiento
		,c.Descripcion AS UbigeoNacimiento
		,b.IdSexo AS IdSexo
		,d.Descripcion AS Sexo
		,b.IdEstadoCivil AS IdEstadoCivil
		,e.Descripcion AS EstadoCivil
		,b.IdTipoPersona AS IdTipoPersona
		,f.Descripcion AS TipoPersona
		,b.IdOcupacion
		,g.Descripcion AS Ocupacion
		,b.IdLugarTrabajo
		,h.Nombres AS LugarTrabajo
		,b.IdEstado AS IdEstado
		,b.FechaRegistro AS FechaRegistro
		,b.UsuarioRegistro AS UsuarioRegistro
		,b.FechaModificacion AS FechaModificacion
		,b.UsuarioModificacion AS UsuarioModificacion
	from persona a
	left join personanatural b ON
		a.IdPersona = b.IdPersona
	left join vw_ubigeo c ON
		b.IdUbigeoNacimiento = c.IdUbigeo
	left join catalogo d ON
		b.IdSexo = d.IdCatalogo
	left join catalogo e ON
		b.IdEstadoCivil = e.IdCatalogo
	left join catalogo f ON
		b.IdTipoPersona = f.IdCatalogo
	left join catalogo g ON
		b.IdOcupacion = g.IdCatalogo
	LEFT JOIN persona h on
		b.IdLugarTrabajo = h.IdPersona
	where
		a.EsEmpresa = 0
		