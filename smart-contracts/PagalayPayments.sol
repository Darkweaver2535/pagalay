// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";

/**
 * @title PagalayPayments
 * @dev Smart contract para manejar pagos de la billetera Pagalay
 * @author Pagalay Team
 */
contract PagalayPayments is ReentrancyGuard, Ownable, Pausable, PullPayment {
    
    // Eventos
    event PaymentMade(
        address indexed from,
        address indexed to,
        uint256 amount,
        bytes32 indexed transactionId,
        uint256 timestamp
    );
    
    event PaymentConfirmed(
        bytes32 indexed transactionId,
        address indexed vendor,
        uint256 timestamp
    );
    
    event VendorRegistered(
        address indexed vendor,
        string businessName,
        uint256 timestamp
    );
    
    // Estructuras
    struct Payment {
        address from;
        address to;
        uint256 amount;
        bool confirmed;
        bool refunded;
        uint256 timestamp;
        string description;
    }
    
    struct Vendor {
        string businessName;
        string location;
        bool isActive;
        uint256 totalReceived;
        uint256 transactionCount;
        uint256 registrationTime;
    }
    
    // Variables de estado
    mapping(bytes32 => Payment) public payments;
    mapping(address => Vendor) public vendors;
    mapping(address => bytes32[]) public userTransactions;
    
    uint256 public feePercentage = 150; // 1.5% en basis points (150/10000)
    uint256 public constant MAX_FEE = 500; // Máximo 5%
    address public feeCollector;
    
    uint256 public totalTransactions;
    uint256 public totalVolume;
    
    // Modificadores
    modifier onlyRegisteredVendor() {
        require(vendors[msg.sender].isActive, "Vendor not registered or inactive");
        _;
    }
    
    modifier validPayment(bytes32 _transactionId) {
        require(payments[_transactionId].amount > 0, "Payment does not exist");
        require(!payments[_transactionId].confirmed, "Payment already confirmed");
        require(!payments[_transactionId].refunded, "Payment already refunded");
        _;
    }
    
    constructor(address _feeCollector) {
        feeCollector = _feeCollector;
    }
    
    /**
     * @dev Registra un nuevo vendedor
     * @param _businessName Nombre del negocio
     * @param _location Ubicación del negocio
     */
    function registerVendor(string memory _businessName, string memory _location) external {
        require(bytes(_businessName).length > 0, "Business name required");
        require(!vendors[msg.sender].isActive, "Vendor already registered");
        
        vendors[msg.sender] = Vendor({
            businessName: _businessName,
            location: _location,
            isActive: true,
            totalReceived: 0,
            transactionCount: 0,
            registrationTime: block.timestamp
        });
        
        emit VendorRegistered(msg.sender, _businessName, block.timestamp);
    }
    
    /**
     * @dev Realiza un pago a un vendedor
     * @param _to Dirección del vendedor
     * @param _transactionId ID único de la transacción
     * @param _description Descripción del pago
     */
    function makePayment(
        address _to,
        bytes32 _transactionId,
        string memory _description
    ) external payable nonReentrant whenNotPaused {
        require(_to != address(0), "Invalid vendor address");
        require(msg.value > 0, "Payment amount must be greater than 0");
        require(vendors[_to].isActive, "Vendor is not active");
        require(payments[_transactionId].amount == 0, "Transaction ID already exists");
        
        // Calcular fee
        uint256 feeAmount = (msg.value * feePercentage) / 10000;
        uint256 vendorAmount = msg.value - feeAmount;
        
        // Guardar información del pago
        payments[_transactionId] = Payment({
            from: msg.sender,
            to: _to,
            amount: msg.value,
            confirmed: false,
            refunded: false,
            timestamp: block.timestamp,
            description: _description
        });
        
        // Actualizar registros de usuario
        userTransactions[msg.sender].push(_transactionId);
        userTransactions[_to].push(_transactionId);
        
        // Transferir fondos
        if (feeAmount > 0) {
            payable(feeCollector).transfer(feeAmount);
        }
        
        // Usar PullPayment para seguridad
        _asyncTransfer(_to, vendorAmount);
        
        // Actualizar estadísticas
        totalTransactions++;
        totalVolume += msg.value;
        
        emit PaymentMade(msg.sender, _to, msg.value, _transactionId, block.timestamp);
    }
    
    /**
     * @dev Confirma un pago recibido (solo vendedor)
     * @param _transactionId ID de la transacción a confirmar
     */
    function confirmPayment(bytes32 _transactionId) 
        external 
        onlyRegisteredVendor 
        validPayment(_transactionId) 
    {
        require(payments[_transactionId].to == msg.sender, "Not authorized");
        
        payments[_transactionId].confirmed = true;
        
        // Actualizar estadísticas del vendedor
        vendors[msg.sender].totalReceived += payments[_transactionId].amount;
        vendors[msg.sender].transactionCount++;
        
        emit PaymentConfirmed(_transactionId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Obtiene información de una transacción
     * @param _transactionId ID de la transacción
     */
    function getPayment(bytes32 _transactionId) 
        external 
        view 
        returns (
            address from,
            address to,
            uint256 amount,
            bool confirmed,
            bool refunded,
            uint256 timestamp,
            string memory description
        ) 
    {
        Payment memory payment = payments[_transactionId];
        return (
            payment.from,
            payment.to,
            payment.amount,
            payment.confirmed,
            payment.refunded,
            payment.timestamp,
            payment.description
        );
    }
    
    /**
     * @dev Obtiene las transacciones de un usuario
     * @param _user Dirección del usuario
     */
    function getUserTransactions(address _user) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return userTransactions[_user];
    }
    
    /**
     * @dev Obtiene información de un vendedor
     * @param _vendor Dirección del vendedor
     */
    function getVendor(address _vendor) 
        external 
        view 
        returns (
            string memory businessName,
            string memory location,
            bool isActive,
            uint256 totalReceived,
            uint256 transactionCount,
            uint256 registrationTime
        ) 
    {
        Vendor memory vendor = vendors[_vendor];
        return (
            vendor.businessName,
            vendor.location,
            vendor.isActive,
            vendor.totalReceived,
            vendor.transactionCount,
            vendor.registrationTime
        );
    }
    
    /**
     * @dev Actualiza el porcentaje de fee (solo owner)
     * @param _newFeePercentage Nuevo porcentaje de fee en basis points
     */
    function updateFeePercentage(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= MAX_FEE, "Fee too high");
        feePercentage = _newFeePercentage;
    }
    
    /**
     * @dev Actualiza el collector de fees (solo owner)
     * @param _newFeeCollector Nueva dirección del collector
     */
    function updateFeeCollector(address _newFeeCollector) external onlyOwner {
        require(_newFeeCollector != address(0), "Invalid address");
        feeCollector = _newFeeCollector;
    }
    
    /**
     * @dev Desactiva un vendedor (solo owner)
     * @param _vendor Dirección del vendedor a desactivar
     */
    function deactivateVendor(address _vendor) external onlyOwner {
        vendors[_vendor].isActive = false;
    }
    
    /**
     * @dev Pausa el contrato (solo owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Despausa el contrato (solo owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Permite retirar pagos pendientes (PullPayment pattern)
     */
    function withdrawPayments(address payable payee) external {
        super.withdrawPayments(payee);
    }
    
    /**
     * @dev Obtiene estadísticas generales del contrato
     */
    function getContractStats() 
        external 
        view 
        returns (
            uint256 _totalTransactions,
            uint256 _totalVolume,
            uint256 _feePercentage,
            address _feeCollector
        ) 
    {
        return (totalTransactions, totalVolume, feePercentage, feeCollector);
    }
}
