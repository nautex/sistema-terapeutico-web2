alter VIEW vw_periodo
AS
	SELECT
		a.IdPeriodo
		,a.IdTipo
		,b.Descripcion AS Tipo
		,a.IdCategoria
		,c.Descripcion AS Categoria
		,a.Codigo
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
		a.IdTipo = b.IdCatalogo
	left join catalogo c ON
		a.IdCategoria = c.IdCatalogo
	left join catalogo d ON
		a.IdEstado = d.IdCatalogo
	
		
	