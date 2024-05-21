alter VIEW vw_terapia
AS
	SELECT
		a.IdTerapia
		,a.IdLocal
		,b.Nombre AS Local
		,a.IdTarifa
		,g.Codigo AS CodigoServicio
		,c.Codigo AS CodigoTarifa
		,c.Monto AS MontoTarifa
		,a.FechaInicio
		,a.IdTipo
		,h.Descripcion AS Tipo
		,a.IdModalidad
		,d.Descripcion AS Modalidad
		,a.SesionesMes
		,a.MinutosSesion
		,a.IdSalon
		,e.Codigo AS Salon
		,a.IdEstado
		,f.Descripcion AS Estado
		,a.Observaciones
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from terapia a 
	left join local b ON
		a.IdLocal = b.IdLocal
	left join tarifa c ON
		a.IdTarifa = c.IdTarifa
	left join catalogo d ON
		a.IdModalidad = d.IdCatalogo
	left join salon e ON
		a.IdSalon = e.IdSalon
	left join catalogo f ON
		a.IdEstado = f.IdCatalogo
	left join servicio g ON
		c.IdServicio = g.IdServicio
	left join catalogo h ON
		a.IdTipo = h.IdCatalogo
	