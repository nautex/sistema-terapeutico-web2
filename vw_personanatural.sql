alter VIEW vw_personanatural
AS
	SELECT
		a.IdPersona
		,a.Nombres
		,a.FechaIngreso
		,a.EsEmpresa
		,b.PrimerNombre
		,b.SegundoNombre
		,b.PrimerApellido
		,b.SegundoApellido
		,b.FechaNacimiento
		,c.IdPais
		,c.Pais
		,c.IdDepartamento
		,c.Departamento
		,c.IdProvincia
		,c.Provincia
		,b.IdUbigeoNacimiento
		,c.Descripcion
		,b.IdSexo
		,d.Descripcion
		,b.IdEstadoCivil
		,e.Descripcion
		,b.IdTipoPersona
		,f.Descripcion
		,b.IdEstado
		,b.FechaRegistro
		,b.UsuarioRegistro
		,b.FechaModificacion
		,b.UsuarioModificacion
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
