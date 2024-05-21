alter VIEW vw_tarifa
AS
	SELECT
		a.IdTarifa
		,a.Codigo
		,a.Descripcion
		,a.IdServicio
		,b.Codigo AS CodigoServicio
		,b.Descripcion AS Servicio
		,a.IdLocal
		,c.Codigo AS CodigoLocal
		,c.Nombre AS Local
		,a.IdTipo
		,f.Descripcion AS Tipo
		,a.IdModalidad
		,d.Descripcion AS Modalidad
		,a.SesionesMes
		,a.MinutosSesion
		,a.Monto
		,a.IdEstado
		,e.Descripcion AS Estado
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from tarifa a 
	left join servicio b ON
		a.IdServicio = b.IdServicio
	LEFT JOIN local c on
		a.IdLocal = c.IdLocal
	LEFT JOIN catalogo d on
		a.IdModalidad = d.IdCatalogo
	LEFT JOIN catalogo e on
		a.IdEstado = e.IdCatalogo
	LEFT JOIN catalogo f on
		a.IdTipo = f.IdCatalogo
		