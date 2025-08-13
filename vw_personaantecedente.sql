ALTER VIEW vw_personaantecedente
as
	select
		a.IdPersona
		, a.Numero
		, a.IdAntecedente
		, b.Descripcion AS Antecedente
		, a.FechaRegistro
		, a.UsuarioRegistro
		, a.FechaModificacion
		, a.UsuarioModificacion
	from personaantecedente a
	left join catalogo b on
		a.IdAntecedente = b.IdCatalogo
