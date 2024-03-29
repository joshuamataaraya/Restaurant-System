USE [Restaurantes]
GO
/****** Object:  StoredProcedure [dbo].[sp_checkLogin]    Script Date: 13/11/2015 11:24:39 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_checkLogin]
	@pNombre varchar(50), 
	@pContrasenna varchar(max)
AS
BEGIN
	SET NOCOUNT ON;
	IF EXISTS(
	
		SELECT Id FROM Clientes WHERE Nombre=@pNombre and Activo=1 and Contrasenna=HASHBYTES ('SHA2_256', @pContrasenna))
	BEGIN
		SELECT Id,'client' as Tipo FROM Clientes WHERE Nombre=@pNombre and Activo=1 and Contrasenna=HASHBYTES ('SHA2_256', @pContrasenna)
	END
	ELSE
	BEGIN
		IF EXISTS(
		SELECT Id FROM Administradores WHERE Nombre=@pNombre and Activo=1 and Contrasenna=HASHBYTES ('SHA2_256', @pContrasenna))
		BEGIN
			SELECT Id,'admin' as Tipo FROM Administradores WHERE Nombre=@pNombre and Activo=1 and Contrasenna=HASHBYTES ('SHA2_256', @pContrasenna)			
		END
		ELSE
		BEGIN
			SELECT -1 AS Id,'none' as Tipo
		END
	END
END

	