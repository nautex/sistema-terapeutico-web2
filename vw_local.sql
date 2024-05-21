alter VIEW vw_local
AS
	SELECT
		a.IdLocal
		,a.Codigo
		,a.Nombre
		,a.IdDireccion
		,b.IdUbigeo
		,e.Codigo as CodigoUbigeo
		,e.Descripcion Ubigeo
		,b.Detalle AS Direccion
		,a.IdTipo
		,c.Descripcion AS Tipo
		,a.IdEstado
		,d.Descripcion AS Estado
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from local a 
	left join direccion b ON
		a.IdDireccion = b.IdDireccion
	left join catalogo c ON
		a.IdTipo = c.IdCatalogo
	left join catalogo d ON
		a.IdEstado = d.IdCatalogo
	LEFT JOIN ubigeo e on
		b.IdUbigeo = e.IdUbigeo
	
	