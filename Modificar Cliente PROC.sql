USE [Restaurantes]
GO
/****** Object:  StoredProcedure [dbo].[sp_modificarCliente]    Script Date: 13/11/2015 10:46:37 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_modificarCliente]
	@pIdUsuario int, --Este ID es del usuario que REALIZA LA TRANSACCION
	@pIdCliente int,--El resto son del cliente a modificar. 
	@pNombre varchar(50),
	@pApellido varchar(50),
	@pTelefono numeric(8,0),
	@pCedula numeric(9,0),
	@pContrasenna varchar(max)=NULL
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRAN modificarCliente

	IF(@pContrasenna IS NOT NULL)
	BEGIN
		UPDATE Clientes 
		SET Nombre=@pNombre,Apellido=@pApellido,Telefono=@pTelefono,
			Cedula=@pCedula,Contrasenna=HASHBYTES ('SHA2_256', @pContrasenna)
		WHERE Id = @pIdCliente
		INSERT INTO Bitacora VALUES (GETDATE(), 'Cliente '+CONVERT(varchar, @pIdCliente)+' modificado.',@pIdUsuario,NULL)
	END
	ELSE
	BEGIN
		UPDATE Clientes 
		SET Nombre=@pNombre,Apellido=@pApellido,Telefono=@pTelefono,
			Cedula=@pCedula
		WHERE Id = @pIdCliente
		INSERT INTO Bitacora VALUES (GETDATE(), 'Cliente '+CONVERT(varchar, @pIdCliente)+' modificado.',@pIdUsuario,NULL)
	END
	COMMIT TRAN modificarCliente
END

