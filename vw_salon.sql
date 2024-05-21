alter VIEW vw_salon
AS
	SELECT
		a.IdSalon
		,a.IdLocal
		,b.Codigo AS CodigoLocal
		,b.Nombre AS Local
		,a.Codigo
		,a.Descripcion
		,a.IdEstado
		,c.Descripcion AS Estado
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from salon a 
	left join local b ON
		a.IdLocal = b.IdLocal
	left join catalogo c ON
		a.IdEstado = c.IdCatalogo
	
	