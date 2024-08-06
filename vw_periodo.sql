alter VIEW vw_periodo
AS
	SELECT
		a.IdPeriodo
		,a.IdTipoTerapia
		,b.Descripcion AS TipoTerapia
		,h.IdPadre AS IdTipoTerapiaPadre
		,a.IdCategoria
		,c.Descripcion AS Categoria
		,a.Codigo
		,a.IdEstadoApertura
		,e.Descripcion AS EstadoApertura
		,a.FechaInicio
		,a.FechaFin
		,a.IdEstado
		,d.Abreviado AS Estado
		,if(a.Observaciones IS NULL, '', a.Observaciones) AS Observaciones
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from periodo a 
	left join catalogo b ON
		a.IdTipoTerapia = b.IdCatalogo
	left join catalogo c ON
		a.IdCategoria = c.IdCatalogo
	left join catalogo d ON
		a.IdEstado = d.IdCatalogo
	left join catalogo e ON
		a.IdEstadoApertura = e.IdCatalogo
	LEFT JOIN catalogogrupo h on
		a.IdTipoTerapia = h.IdHijo
		AND h.IdGrupo = 1
	
		
	