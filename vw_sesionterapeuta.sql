alter VIEW vw_sesionterapeuta
AS
	SELECT
		a.IdSesion
		,a.Numero
		,a.IdTerapeuta
		,b.Nombres AS Terapeuta
		,a.IdTipoCargo
		,c.Descripcion AS TipoCargo
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from sesionterapeuta a
	LEFT JOIN persona b on
		a.IdTerapeuta = b.IdPersona
	LEFT JOIN catalogo c on
		a.IdTipoCargo = c.IdCatalogo
