pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/StdJson.sol";
import "forge-std/console.sol";
import "openzeppelin-contracts/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "openzeppelin-contracts/contracts/proxy/transparent/ProxyAdmin.sol";

import {YieldDistributor} from "breadchain/src/YieldDistributor.sol";
import {ButteredBread, IButteredBread} from "breadchain/src/ButteredBread.sol";

contract Deploy is Script {
    address _owner = address(0x918dEf5d593F46735f74F9E2B280Fe51AF3A99ad);

    // Buttered Bread config
    address[] _liquidityPools = [
        address(0xf3D8F3dE71657D342db60dd714c8a2aE37Eac6B4)
    ];
    uint256[] _scalingFactors = [100];
    string _bbName = "ButteredBread";
    string _bbSymbol = "BB";

    // Distributor Config
    address _bread = address(0xa555d5344f6FB6c65da19e403Cb4c1eC4a1a5Ee3);
    uint256 _minRequiredVotingPower = 5;
    uint256 _cycleLength = 60;
    uint256 _maxPoints = 10000;
    uint256 _precision = 1000000000000000000;
    uint256 _yieldFixedSplitDivisor = 2;
    address[] projects = [
        address(0x7E1367998e1fe8Fab8f0bbF41e97cD6E0C891B64),
        address(0x5405e2D4D12AAdB57579E780458c9a1151b560F1),
        address(0x5c22B3F03b3d8FFf56C9B2e90151512Cb3F3dE0F),
        address(0x6A148b997e6651237F2fCfc9E30330a6480519f0),
        address(0x918dEf5d593F46735f74F9E2B280Fe51AF3A99ad)
    ];

    function run() external {
        vm.startBroadcast();

        // buttered bread
        IButteredBread.InitData memory _initData = IButteredBread.InitData({
            breadToken: _bread,
            liquidityPools: _liquidityPools,
            scalingFactors: _scalingFactors,
            name: _bbName,
            symbol: _bbSymbol
        });

        bytes memory _implementationData = abi.encodeWithSelector(
            ButteredBread.initialize.selector,
            _initData
        );

        address butteredBreadImplementation = address(new ButteredBread());
        ButteredBread butteredBread = ButteredBread(
            address(
                new TransparentUpgradeableProxy(
                    butteredBreadImplementation,
                    _owner,
                    _implementationData
                )
            )
        );

        // Distributor
        uint256 _lastClaimedBlockNumber = vm.getBlockNumber();
        bytes memory initData = abi.encodeWithSelector(
            YieldDistributor.initialize.selector,
            _bread,
            address(butteredBread),
            _precision,
            _minRequiredVotingPower,
            _maxPoints,
            _cycleLength,
            _yieldFixedSplitDivisor,
            _lastClaimedBlockNumber,
            projects
        );
        YieldDistributor yieldDistributorImplementation = new YieldDistributor();
        YieldDistributor yieldDistributor = YieldDistributor(
            address(
                new TransparentUpgradeableProxy(
                    address(yieldDistributorImplementation),
                    _owner,
                    initData
                )
            )
        );

        console2.log(
            "Deployed ButteredBread at address: {}",
            address(butteredBread)
        );
        console2.log(
            "Deployed YieldDistributor at address: {}",
            address(yieldDistributor)
        );
        vm.stopBroadcast();

        // write both deployed contract addresses to file
        string memory distributorSerialized = vm.serializeAddress(
            "DISTRIBUTOR",
            "ADDRESS",
            address(yieldDistributor)
        );
        string memory butteredBreadSerialized = vm.serializeAddress(
            "BUTTERED_BREAD",
            "ADDRESS",
            address(butteredBread)
        );
        vm.writeJson(distributorSerialized, "./out/DISTRIBUTOR.json");
        vm.writeJson(butteredBreadSerialized, "./out/BUTTERED_BREAD.json");
    }
}
