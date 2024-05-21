alter VIEW vw_terapiaterapeuta
AS
	SELECT
		a.IdTerapia
		,a.Numero
		,a.IdTerapeuta
		,b.Nombres AS Terapeuta
		,a.IdTipoCargo
		,c.Descripcion AS TipoCargo
		,a.FechaInicio
		,a.FechaFin
		,a.IdEstado
		,d.Descripcion AS Estado
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from terapiaterapeuta a 
	left join persona b ON
		a.IdTerapeuta = b.IdPersona
	LEFT JOIN catalogo c on
		a.IdTipoCargo = c.IdCatalogo
	LEFT JOIN catalogo d on
		a.IdEstado = d.IdCatalogo
	